import React from 'react';


function Image(props) {
  const {src} = props;

  return <img src={src} width={400} height={400} />;
}

function App() {
  return (
    <>
      <Image src="https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"/>
      <Image src="https://images.unsplash.com/photo-1455311683036-3e949a996256?ixlib=rb-1.2.1&auto=format&fit=crop&w=1605&q=80"/>
    </>
  );
}

export default App;
