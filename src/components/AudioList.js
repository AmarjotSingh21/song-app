import React, { useState, useEffect } from 'react';
import PaginationButtons from './PaginationButtons';
import AUDIO_ATTRIBUTES from '../models/AudioAttributes';
import DownloadCSV from './DownloadCSV';
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";


const AudioList = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState();
    const [searchTitle, setSearchTitle] = useState('');


    const setPageNumber = (url) => {
        const queryString = url.split('?')[1];
        if (queryString === undefined) {
            setPage('1');
        } else {
            const urlSearchParam = new URLSearchParams(queryString);
            setPage(urlSearchParam.get('page'));
        }
    }



    const fetchAudioList = async (url) => {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();

            setData(jsonData);
            setLoading(false);
            setPageNumber(url);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchAudioByTitle(searchTitle);
    };

    const fetchAudioByTitle = async (title) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/audio/${title}`);
            if (response.status === 404) {
                setData({ 'next': null, 'previous': null, 'results': [] });
                return;
            }
            const jsonData = await response.json();

            setData({ 'next': null, 'previous': null, 'results': [jsonData] });

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/audio/?page=1';
        fetchAudioList(url);
        // eslint-disable-next-line
    }, []);




    const [sortedField, setSortedField] = useState(null);
    const [ascSort, setAscSort] = useState(true);

    const handleSort = (field) => {
        if (sortedField === field) {
            setAscSort(!ascSort);
        } else {
            setSortedField(field);
            setAscSort(true);
        }
    };

    const sortedData = (data) => {
        return data === undefined ? [] : [...data.results].sort((a, b) => {
            if (!sortedField) return 0;
            let aValue = a[sortedField];
            let bValue = b[sortedField];

            if (typeof a[sortedField] === 'string') {
                aValue = a[sortedField].toLowerCase();
                bValue = b[sortedField].toLowerCase();
            }

            if (aValue === bValue) return 0;
            if (ascSort) {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }


    return (
        <div>
            <a href='/'> <h1>PlayList</h1></a>
            {loading ? (
                <p>Loading...</p>
            ) :

                <div>
                    <form className="row g-3 justify-content-end mx-3" onSubmit={handleSubmit}>
                        <div className="col-auto">
                            <input type="text" className="form-control" id="title" placeholder="Song Title" onChange={(e) => setSearchTitle(e.target.value)} />
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary mb-3" >Get Song</button>
                        </div>
                    </form>
                    {
                        (data.results === undefined || data.results.length === 0) ?
                            <h1 className='text-center'>No Audio Found</h1> :
                            <div>
                                <div className="table-responsive my-3">
                                    <table className="table table-striped w-auto text-nowrap table-bordered">
                                        <thead>
                                            <tr>
                                                {
                                                    AUDIO_ATTRIBUTES.map((col) => {
                                                        return <th scope="col" key={col.field} onClick={() => handleSort(col.field)}>{col.headerName}
                                                            {sortedField === col.field ? ascSort ? <BsArrowDownShort /> : <BsArrowUpShort /> : ''}
                                                        </th>
                                                    })
                                                }

                                            </tr>
                                        </thead>
                                        <tbody className='table-group-divider'>
                                            {
                                                sortedData(data).map((row, index) => {
                                                    return <tr key={index}>
                                                        {
                                                            AUDIO_ATTRIBUTES.map((col) => {
                                                                return <td key={col.field}>{row[col.field]}</td>;
                                                            })
                                                        }
                                                    </tr>
                                                })
                                            }

                                        </tbody>
                                    </table>

                                </div>
                                <div className='container-fluid'>
                                    <div className='row justify-content-space-between'>
                                        {PaginationButtons(fetchAudioList, data, page)}
                                        <div className='col'></div>
                                        <DownloadCSV data={sortedData(data)} filename={'playlist.csv'} />
                                    </div>
                                </div>
                            </div>}
                </div>
            }
        </div>
    );
};

export default AudioList;

