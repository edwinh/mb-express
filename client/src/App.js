import React, {useState, useEffect} from 'react';
import './App.css';
//import { Button } from 'reactstrap';
import axios from 'axios';
import { Table } from 'reactstrap'


function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('/harvest?from=20200320&userName=Werner Bootsman');
      setData(result.data);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <Table striped dark responsive size="sm">
        <thead>
          <tr>
            <th class="text-left">Date</th>
            <th class="text-left">Name</th>
            <th class="text-left">Project</th>
            <th class="text-right">Hours</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              <td class="text-left">{item.spentDate.substring(0,10)}</td>
              <td class="text-left">{item.userName}</td>
              <td class="text-left">{item.projectName}</td>
              <td class="text-right">{item.hours}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
