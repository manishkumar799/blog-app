export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout'
  },
  POSTS: {
    GET_ALL: '/posts',
    GET_BYid: '/posts',
    CREATE: '/posts',
    UPDATE: '/posts',
    DELETE: '/posts'
  },
  COMMENTS: {
    GET_BY_POST: '/comments',
    CREATE: '/comments'
  }
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  POST_DETAIL: '/posts',
  CREATE_POST: '/create-post',
  EDIT_POST: '/edit-post'
}