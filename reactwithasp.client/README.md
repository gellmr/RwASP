# React

This is the client side of the application. A compiled JavaScript payload containing the React components is downloaded to the user's browser, which mounts and begins to execute the React render lifecycle. This fetches data from the server by making Ajax calls to controller actions. I have used Axios and Axios-Retry to fetch data.

The client side uses Redux to persist and share application state, among different components. Components subscribe to the Redux store to read data, and dispatch events which are handled by Redux slices. This is like a context and reducer in React.

I have used 'Asynchronous Thunk' in a few places where the Ajax updates would otherwise have triggered effects to execute in an infinite loop.

The client also makes use of React Router, and BootStrap React.
