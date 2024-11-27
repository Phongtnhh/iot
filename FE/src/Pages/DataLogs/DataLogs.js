import './DataLogs.css';
import { useState, useEffect, useRef } from 'react';
import { URL } from '../../Components/Helper/URL';

function DataLogs() {
    const [data, setData] = useState([]);
    const [selectKey, setSelectKey] = useState('');
    const [selectInput, setSelectInput] = useState('');
    const [selectRow, setSelectRow] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const inputRef = useRef(null);

    const [params, setParams] = useState({
        searchKey: '',
        searchValue: '',
        page: 1,
        limit: 10,
        sortKey: '',
        sortValue: ''
    });

    const fetchApi = () => {
        const apiURL = `${URL}/function?searchKey=${params.searchKey}&searchValue=${params.searchValue}&page=${params.page}&limit=${params.limit}&sortKey=${params.sortKey}&sortValue=${params.sortValue}`;
        fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                setData(data.results);
                if (data.totalPages) setTotalPage(data.totalPages);
            });
    };

    useEffect(() => {
        fetchApi();
    }, [params]);

    const handleChangeSelectKey = (e) => setSelectKey(e.target.value);
    const handleChangeSelectInput = (e) => setSelectInput(e.target.value);

    const handleChangeSelectRow = (e) => {
        setSelectRow(e.target.value);
        setParams({ ...params, limit: e.target.value, page: 1 });
    };

    const handleNextPage = () => {
        if (params.page < totalPage) {
            setParams(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrePage = () => {
        if (params.page > 1) {
            setParams(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleClickSearch = () => {
        setParams({
            ...params,
            searchKey: selectKey,
            searchValue: selectInput,
            page: 1
        });
        inputRef.current.value = '';
    };

    const handleClickSort = (sortKey) => {
        const sortValue = (params.sortKey === sortKey && params.sortValue === 'asc') ? 'desc' : 'asc';
        setParams({
            ...params,
            sortKey: sortKey,
            sortValue: sortValue,
            page: 1
        });
    };

    return (
        <>
            <div className='action'>
                <h2 className="action-title">DataLog</h2>
                <div className="option">
                    <div className="search">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            className="search__input"
                            onChange={handleChangeSelectInput}
                        />
                        <i className="fa-solid fa-magnifying-glass search__icon" onClick={handleClickSearch}></i>
                    </div>
                    <div className="radio">
                        <div className="select">
                            <select value={selectKey} className="select__list" onChange={handleChangeSelectKey}>
                                <option value="temperature">Temperature</option>
                                <option value="humidity">Humidity</option>
                                <option value="light">Light</option>
                                <option value="time">Time</option>
                                <option value="" hidden>-- Select --</option>
                            </select>
                        </div>
                        
                    <div className="select2">
                        <select value={selectRow} className="select__list" onChange={handleChangeSelectRow}>
                            <option value={10}>10 rows</option>
                            <option value={20}>20 rows</option>
                            <option value={30}>30 rows</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div className='table__container'>
                    <table className="table">
                        <thead className="table__head">
                            <tr className="table-row__head">
                                <th onClick={() => handleClickSort("id")}>ID</th>
                                <th onClick={() => handleClickSort("temperature")}>Temperature (°C)</th>
                                <th onClick={() => handleClickSort("humidity")}>Humidity (%)</th>
                                <th onClick={() => handleClickSort("light")}>Light (lux)</th>
                                <th onClick={() => handleClickSort("time")}>Time</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {data.map((item, index) => (
                                <tr className="table-row__body" key={index}>
                                    <td className="table-row__item">{item.id}</td>
                                    <td className="table-row__item">{item.temperature}</td>
                                    <td className="table-row__item">{item.humidity}</td>
                                    <td className="table-row__item">{item.light}</td>
                                    <td className="table-row__item">{item.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='pagination'>
                    <ul className='pagi__list'>
                        <li className='pagi__pre pagi__item' onClick={handlePrePage}>
                        {totalPage === 1 ? "" : 
                            <>
                                { params.page === 1 ? "" : 
                                <>
                                <i class="fa-solid fa-backward"></i>
                                </>
                                }
                            </>
                            }
                        </li>
                        <li className='pagi__cur pagi__item'>{params.page}</li>
                        <li className='pagi__next pagi__item' onClick={handleNextPage}>
                            {totalPage === 1 ? "" : 
                            <>
                                { params.page === totalPage ? "" : 
                                <>
                                <i class="fa-solid fa-forward"></i>
                                </>
                                }
                            </>
                            }
                            
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default DataLogs;
