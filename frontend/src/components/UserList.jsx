import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState(''); // keywords
  const [pages, setPages] = useState(0); // total pages
  const [rows, setRows] = useState(0); // total rows
  const [query, setQuery] = useState(''); // set Query Search
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getUsers();
  }, [page, keyword, limit]);

  const getUsers = async () => {
    const res = await axios.get(`${import.meta.env.VITE_HOST}/users?page=${page}&search=${keyword}&limit=${limit}`);
    setUsers(res.data.data);
    setPage(res.data.page);
    setPages(res.data.totalPage);
    setRows(res.data.totalRows);
  };

  const handleChangePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) setMsg('Jika data belum ditemukan, silahkan gunakan fitur search!');
    else setMsg('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  return (
    <>
      <div className='container mt-5'>
        <div className='columns'>
          <div className='column is-centered'>
            <form onSubmit={handleSearch}>
              <div className='field has-addons'>
                <div className='control is-expanded'>
                  <input type='text' className='input' placeholder='Find Here...' value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className='control'>
                  <button type='submit' className='button is-info'>
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className='is-flex is-align-items-center mt-3'>
              <p className='mr-3'>Limit:</p>
              <div className='select'>
                <select value={limit} onChange={(e) => setLimit(e.target.value)}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <table className='table is-stripped is-bordered is-fullwidth mt-3 '>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p>
              Total Rows: {rows} | Page: {rows ? page + 1 : 0} of {pages}
            </p>
            <p className='has-text-centered has-text-danger'>{page === 9 && msg}</p>
            <nav key={rows} className='pagination is-centered' role='navigation' aria-label='pagination'>
              <ReactPaginate
                previousLabel={'< Prev'}
                nextLabel={'Next >'}
                pageCount={Math.min(10, pages)}
                onPageChange={handleChangePage}
                containerClassName={'pagination-list'}
                pageLinkClassName={'pagination-link'}
                previousLinkClassName={'pagination-previous'}
                nextLinkClassName={'pagination-next'}
                activeLinkClassName={'pagination-link is-current'}
                disabledLinkClassName={'pagination-link is-disabled'}
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
