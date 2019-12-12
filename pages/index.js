import React, {Fragment, useState} from 'react'
import Head from 'next/head'
import KameraLayout from '../components/KameraLayout'

import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import { withAuthSync, logout } from '../utils/auth'
import getHost from '../utils/get-host'

function Index(props){
  console.log(props);

  return (
      <Fragment>
        <Head>
            <title>Kamera App</title>
        </Head>
        <KameraLayout data={props.data} logout={logout} />
      </Fragment>
  )
}

Index.getInitialProps = async ctx => {
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
    }
  }
  

export default withAuthSync(Index)