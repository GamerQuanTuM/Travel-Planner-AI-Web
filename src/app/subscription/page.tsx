import React from 'react'
import Subscription from './subscription'
import { getSession } from '@/lib/dal'

async function Page() {
    const session = await getSession();
    return (
        <Subscription session={session} />
    )
}

export default Page