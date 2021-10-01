import { useQuery } from "react-query";
import axios from "axios";

const fetchPosts = () =>
  axios
    .get("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.data);

export const usePosts = () => useQuery(["posts", "list"], fetchPosts);

const fetchPost = (id) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then((response) => response.data);

export const usePost = (id) =>
  useQuery(["posts", "detail", id], () => fetchPost(id));

const fetchCmnts = () =>
  axios
    .get("http://localhost:3000/comments")
    .then((response) => response.data);

export const useCmnts = () => useQuery(["cmnts"], fetchCmnts);