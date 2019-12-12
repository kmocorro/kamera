import React, {Fragment, useState} from 'react'
import Head from 'next/head'
import BoatLayout from '../components/BoatLayout'

import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import { withAuthSync, logout } from '../utils/auth'
import getHost from '../utils/get-host'

import { useRouter } from 'next/router';

import URLSafeBase64 from 'urlsafe-base64';

function Boat(props){
  
    const router = useRouter();
    const imageSrcBuff = URLSafeBase64.decode(router.query.src);
    const imageSrcBase64 = URLSafeBase64.decode(router.query.src).toString('base64');
    
  return (
      <Fragment>
        <Head>
            <title>Kamera App</title>
        </Head>
        <BoatLayout data={props} imageSrcBase64={imageSrcBase64} imageSrcBuff={imageSrcBuff} logout={logout} imgSrcId={router.query.id} />
      </Fragment>
  )
}

Boat.getInitialProps = async ctx => {

    const { token }  = nextCookie(ctx)
    const apiUrl = getHost(ctx.req) + '/api/index'
  
    const redirectOnError = () =>
      typeof window !== 'undefined'
        ? Router.push('/login')
        : ctx.res.writeHead(302, { Location: '/login' }).end()
  
    try {
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          Authorization: JSON.stringify({ token })
        }
      });
  
      const js = await response.json()
      return js;

  
    } catch (error) {
      // Implementation or Network error
      console.log(error);
      console.log('catch errorrrrr.')

    }

  }
  

export default withAuthSync(Boat)