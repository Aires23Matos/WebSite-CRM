import React from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/Navbar';
import "./list.css"
import Datatable from '../../components/datatable/Datatable';

const List = () => {
    return (
       <div>
        <Navbar/>
         <div className='list'>
               
            <Sidebar/>
            <div className='listContainer'>
             
              <Datatable/>
            </div>
        </div>
       </div>
    );
};

export default List;