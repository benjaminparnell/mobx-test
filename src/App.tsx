import React, { createContext, useContext, FC } from "react";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";
import UserStore, { UserModelType, UserType } from "./models/UserStore";

const initialState: UserType = {
  firstName: "Ben",
  lastName: "Parnell",
  email: "ben.parnell@clock.co.uk",
};

// Create a store with the initial state
const createStore = () => {
  const store = UserStore.create(initialState);
  return store;
};

const store = createStore();

// Create a context to pass our store around. This is easier than drilling the store
// down via props into every component.
const StoreContext = createContext<{ store: UserModelType }>(
  { store }
);

const useStore = () => useContext(StoreContext);

// The top level component takes the initialised store as a prop to pass into the provider
// created above
interface AppProps {
  store: UserModelType;
}

const App: FC<AppProps> = ({ store }) => {
  return (
    <StoreContext.Provider value={{ store }}>
      <InitialNameShower />
      <NameShower />
      <button
        onClick={() =>
          store.changeName(store.firstName === "Ben" ? "Alfie" : "Ben")
        }
      >
        Change name
      </button>
    </StoreContext.Provider>
  );
};

// Even though this component uses the useStore hook and reads from it, it will only ever render once as its not wrapped in observer().
const InitialNameShower: FC = () => {
  const { store: { firstName } } = useStore();
  return (
    <div>
      <p>Initial first name: {firstName}</p>
    </div>
  )
}

// If you remove the observer wrapping this component then the values don't update anymore when you click the button. That's
// because the observer is the thing making the re render happen when the values change.
const NameShower: FC = observer(({}) => {
  const { store: { firstName, lastName, fullName } } = useStore();
  return (
    <div>
      <p>firstName: {firstName}</p>
      <p>lastName: {lastName}</p>
      <p>fullName: {fullName}</p>
    </div>
  );
});

// mobx-react will only trigger re renders in components wrapped in observer() if the state they're accessing changes.
//
// Take the example below. You'll only ever see this component log "rendered" once, as the lastName never changes in the store.
// This is where the rendering efficiency of mobx comes from.
//
// This means wrapping all components in observer in most cases is not a bad thing, as if they aren't pulling in any store values
// then 

// const LastNameShower: FC = observer(({}) => {
//   const { store: { lastName } } = useStore();
// . console.log('rendered')
//   return (
//     <div>
//       <p>lastName: {lastName}</p>
//     </div>
//   );
// });


render(<App store={store} />, document.getElementById("app"));
