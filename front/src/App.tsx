import {RouterProvider} from 'react-router-dom';
import router from './router';
import WithAuth from './hooks/auth';

function App() {
  return (
    <div className="App">
      <WithAuth>
        <RouterProvider router={router} />
      </WithAuth>
    </div>
  );
}

export default App;
