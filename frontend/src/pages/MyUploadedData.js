import React, { useState, useEffect, useContext } from 'react';
import Menu from '../components/Menu';
import User from "../components/User";
import DataTable from '../components/DataTable';
import { formatFileSize, datetimeFormat } from '../components/utils';
import UserPool from '../components/UserPool';


function MyUploadedData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  var user = UserPool.getCurrentUser();
  var sess;
  if(user != null){
    user.getSession(function (err, session) { 
      if (err) {
        alert(err.message || JSON.stringify(err));
        window.location.href = '/login';
        return;
      }
      sess = session;
    });
  }
  else{
    window.location.href = '/login';
}

  useEffect(() => {
    const fetchUploadedData = async () => {
      try {
        const username = sess['idToken']['payload']['cognito:username'];
        const response = await fetch(`http://127.0.0.1:5000/display_my_uploads?username=${username}`);
        const names = await response.json();
        const data = names.map(obj => ({
            name: obj.Name,
            description: obj.Description,
            size: formatFileSize(obj.Size),
            modified: datetimeFormat.format(new Date(obj.LastModified)),
            uploadedBy: obj.UploadedBy
        }));
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching uploaded data:', error);
        setLoading(false);
      }
    };
    fetchUploadedData();
  }, []);

  return (
    <div>
      <User/>
      <Menu />
      <div className="header">
        <h1>Datasets I've Uploaded</h1>
      </div>
      <DataTable data={data} loading={loading} />
    </div>
  );
}

export default MyUploadedData;
