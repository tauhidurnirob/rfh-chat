import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
  initialState: {
    cmnts: []
  },
  actions: {
    setStore: (newState) => ({ setState }) => {
      setState({
        cmnts: newState
      });
    },
    setCmnts: (newState) => ({ setState, getState }) => {
      const { cmnts } = getState();
      setState({
        cmnts: [...cmnts, newState]
      });
    },
    // removeItems: (id) => ({ setState, getState }) => {
    //     let { items } = getState();
    //     items = items.filter((f)=> f.id !== id)
    //     setState({ items: items });
    // }
  }
});

export const useComments = createHook(Store);