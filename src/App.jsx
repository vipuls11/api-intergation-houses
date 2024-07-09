import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch(
          "https://anapioficeandfire.com/api/houses"
        );
        const dataResponse = await response.json();

        const responseSwornMember = await Promise.all(
          dataResponse.map(async (items) => {
            const swornMembers = await Promise.all(
              items.swornMembers.map(async (swornUrl) => {
                const swornResponse = await fetch(swornUrl);
                const swornData = await swornResponse.json();
                return swornData;
              })
            );
            return { ...items, swornMembers };
          })
        );

        setData(responseSwornMember);
      } catch (err) {
        console.error(err.message);
      } 
        setLoading(false);
    };

    fetchHouses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>API integration</h1>
        <table className="table">
          <tbody>
            <tr className="table_head">
              <th>House</th>
              <th>Region</th>
              <th>Title</th>
              <th>Sworn Members</th>
            </tr>

            {data.map((items, index) => (
              <tr key={index} className="table_content">
                <td>{items.name}</td>
                <td>{items.region}</td>
                <td>
                  {items.titles.length > 0 ? items.titles : "None"}
                </td>
                <td>
                  {items.swornMembers.length > 0 ? (
                    items.swornMembers.map((member, index) => (
                      <p key={index}>{member.name}</p>
                    ))
                  ) : (
                    <p>None</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
