function Testing({ data, loading }) {
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <h1>Testing Dashboard 😋</h1>

      <div className="dashboard1">
        {data.map(item => (
          <div key={item.id} className="card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Testing