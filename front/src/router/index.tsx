import React from 'react';
import {createBrowserRouter, RouteObject} from 'react-router-dom';
import Login from '../components/login';
import VideoPlay from '../components/video_play';
import FileUpload from '../components/file_list';
import Home from '../components/home';
import Index from '../components/index';
import OpenAi from '../components/openai';
import Cache from '../components/cache/cache';
import WithCache from '../components/cache/with_cache';
import DoorPassword from '../components/door_password';
import Register from '../components/register';

const routes: RouteObject[] = [
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/',
    element: (
      <WithCache>
        <Index></Index>
      </WithCache>
    ),
    children: [
      {
        path: 'home',
        element: <Home/>,
      },
      {
        path: 'fileList',
        element: (
          <>
            <Cache onlyKey={'fileList'}>
              <FileUpload/>
            </Cache>
          </>
        ),
      },
      {
        path: 'videoPlay/:link',
        element: (
          <VideoPlay open={true} onClose={() => {}} src={''}></VideoPlay>
        ),
      },
      {
        path: 'openai',
        element: <OpenAi></OpenAi>,
      },
      {
        path: 'door_password',
        element: <DoorPassword/>,
      },
    ],
  },
];
const router = createBrowserRouter(routes);
export default router;
