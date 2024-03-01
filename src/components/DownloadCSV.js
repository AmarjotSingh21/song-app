import React from 'react';
import AUDIO_ATTRIBUTES from '../models/AudioAttributes';

const DownloadCSV = ({ data, filename }) => {

    const convertToCSV = (data) => {
        const csvContent = [];
        const headerRow = AUDIO_ATTRIBUTES.map((col) => { return col.headerName; }).join(',');
        csvContent.push(headerRow);
        data.forEach((row) => {
            const values = AUDIO_ATTRIBUTES.map((col) => {
                return row[col.field];
            }).join(',');
            csvContent.push(values);

        });
        return csvContent.join('\n');
    };

    const handleDownload = () => {
        const csvData = convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const csvURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button className='btn btn-primary mx-3' style={{ width: '200px' }} onClick={handleDownload}>Download CSV</button>
    );
};

export default DownloadCSV;
