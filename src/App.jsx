/* src/App.jsx */
import HomePage from './pages/HomePage';
import { TasksProvider } from './Context/TasksContext'; // 1. Import the Power Source

function App() {
  return (
    // 2. Wrap the app. Now everything inside can use the "Context".
    <TasksProvider>
      <HomePage />
    </TasksProvider>
  );
}

export default App;