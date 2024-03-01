import React from 'react';

const PaginationButtons = (fetchData, data, page) => {
    return (
        <div className="btn-group mx-3" style={{ width: '300px' }} role="group">
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fetchData(data.previous)}
                disabled={data.previous === null}
            >
                Prev Page
            </button>
            <button type="button" className="btn btn-secondary">
                {page === undefined ? '1' : page}
            </button>
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fetchData(data.next)}
                disabled={data.next === null}
            >
                Next Page
            </button>
        </div>
    );
}

export default PaginationButtons;
