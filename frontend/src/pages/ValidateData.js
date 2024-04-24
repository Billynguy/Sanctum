import React, { useState, useEffect, useContext } from "react";
import Menu from "../components/Menu";
import ValidatorTable from "../components/ValidatorTable";
import { formatFileSize, datetimeFormat } from '../components/utils';
import UserPool from '../components/UserPool';

function ValidateData(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableKey, setTableKey] = useState(0);

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
        if (sess['idToken']['payload']['custom:user-type'] ==='Validator') {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/display_nonvalidated_files');
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
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };
    
            fetchData();
        }
    }, [tableKey]);

    const handleTableReload = () => {
        setTableKey(prevKey => prevKey + 1); // Update tableKey to trigger re-render
        setLoading(true)
    };

    return (
        <div>
            <Menu/>
            <h1>Validate Data Page</h1>
            <ValidatorTable data={data} loading={loading} onValidation = {handleTableReload}></ValidatorTable>
        </div>
    );
}

export default ValidateData;