import { createStore, createHook } from 'react-sweet-state';

const Store = createStore({
    initialState: {
        loading: false,
        sessionCreatedEvent: null,
        sessionLoggedInEvent: null,
        categories: null,
        communities: null,
        comments: []
    },
    actions: {
        setLoading: (val) => ({setState}) => {
            setState({
                loading: val
            })
        },
        setSessionCreatedEvent: (event) => ({setState}) => {
            setState({
                sessionCreatedEvent: event
            })
        },
        setSessionLoggedInEvent: (event) => ({setState}) => {
            setState({
                sessionLoggedInEvent: event
            })
        },
        setCategories: (val) => ({setState}) => {
            setState({
                categories: val
            })
        },
        setCommunities: (val) => ({setState}) => {
            setState({
                communities: val
            })
        },
        setComments: (newState) => ({ setState, getState }) => {
            const { comments } = getState();
            setState({
                comments: [...comments, newState]
            });
        },
    }
});

export const useAppState = createHook(Store);