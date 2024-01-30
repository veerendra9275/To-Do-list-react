import './App.css';
import axios from 'axios';
import {useState, useEffect, Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {toast} from 'react-toastify';

function App() {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [todo, setTodo] = useState('');
  const [todoId, setTodoId] = useState(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function getData() {
    axios.get('https://jsonplaceholder.typicode.com/todos').then(res => {
      setData(res.data);
    });
  }
  function handleDelete(id) {
    axios
      .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        alert('TODO is deleted!');
        const filter = data?.filter(item => item.id !== id);
        setData(filter);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  const handleAddTodo = async () => {
    const payload = {
      completed: false,
      id: data.length + 1,
      title: todo,
      userId: '',
    };

    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(() => {
        toast.success('Todo Added!');
        const todos = [...data, payload];

        setData(todos);
        setTodo('');
        closeModal();
      }).catch(() => toast.error('Something went wrong'));
  };
  const updateTodo = async () => {
    const payload = {
      completed: false,
      id: data.length + 1,
      title: todo,
      userId: '',
    };

    fetch(`https://jsonplaceholder.typicode.com/posts/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(() => {
        toast.success('Todo updated!');
        const todos = [...data, payload];

        setData(todos);
        setTodo('');
        closeModal();
      }).catch(() => toast.error('Something went wrong'));
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <p className="">TODO APP!</p>
        <button disabled={isOpen} className="btn-danger" onClick={openModal}>
          Add Todo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {data.map(x => {
          return (
            <>
              <div className=" bg-white relative my-4 shadow-lg rounded-lg flex justify-between p-4 pb-8 items-center">
                <p className="text-black font-bold text-md">{x.title}</p>
                <div>
                  <p className="text-black">
                    {x.completed ? 'Completed' : 'Not Completed'}
                  </p>
                  <button
                    className="btn-danger"
                    style={{backgroundColor: 'red', width: 140}}
                    disabled={isOpen}
                    onClick={() => handleDelete(x.id)}>
                    Delete
                  </button>
                </div>
                <div className=' px-6 rounded-l-lg bg-blue-500 cursor-pointer absolute bottom-0 right-0' onClick={() => { 
                  openModal();
                  setTodo(x.title);
                  setTodoId(x.id);
                }}>
                  Edit
                </div>
              </div>
            </>
          );
        })}
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    Add New TODO
                  </Dialog.Title>
                  <div className="mt-6">
                    <input
                      type="text"
                      value={todo }
                      onChange={e => setTodo(e.target.value)}
                      className="w-full bg-transparent text-black border border-blue-400 rounded-lg p-3"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={todoId ? updateTodo : handleAddTodo}>
                      {todoId ? 'Update!' : 'Add!'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default App;
