import React, { Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { jbc } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Headbar from './Headbar'
import Home from './Home'
import Swap from './Swap'

const v = '0.0.3'
const projectId = '1387f8ef666a56825e503ca148275bcb'
const queryClient = new QueryClient()
const wagmiAdapter = new WagmiAdapter({
    networks: [jbc],
    projectId,
    ssr: true
})
createAppKit({
    adapters: [wagmiAdapter],
    networks: [jbc],
    projectId,
    themeMode: 'dark',
    themeVariables: {
        '--w3m-font-family': 'Inter',
        '--w3m-font-size-master': '8px',
        '--w3m-z-index': 1000, 
    },
    chainImages: {
        8899: 'https://gateway.commudao.xyz/ipfs/bafkreihdmsnmmzhepcfxuvoflht2iqv5w73hg5kbgrc33jrhk7il5ddpgu?img-width=100&img-height=100',
    },
    features: {
        analytics: true,
    }
})

const Fields = React.lazy(() => import('./Fields'))
const CmdaoValley = React.lazy(() => import('./Fields-CmdaoValley'))

export default function Main() {    
    const navigate = useNavigate()
    const { modeText, subModeText, intrasubModetext } = useParams()
    let preset = 0
    if (modeText !== undefined) {
        if (modeText.toUpperCase() === "FIELDS") {
            if (subModeText !== undefined) {
                if (modeText.toUpperCase() === "FIELDS" && subModeText.toUpperCase() === "CMDAO-VALLEY") {
                    preset = 11
                    document.title = "CMDAO Valley | OpenBBQ"
                }
            } else {
                preset = 1
                document.title = "Fields | OpenBBQ"
            }
        } else if (modeText.toUpperCase() === "SWAP") {
            preset = 2
            document.title = "Swap | OpenBBQ"
        } else {
            preset = 404
            document.title = "404 | OpenBBQ"
        }
    } else {
        document.title = "OpenBBQ"
    }
    const [mode, setMode] = React.useState(preset) 
    const callMode = (_mode: number) => { setMode(_mode) }
    const [isLoading, setIsLoading] = React.useState(false)
    const [errMsg, setErrMsg] = React.useState<String | null>(null)
    const [txupdate, setTxupdate] = React.useState<String | null>(null)

    return (
        <>
            {isLoading &&
                <div className="centermodal">
                    <div className="wrapper" />
                </div>
            }
            {errMsg !== null &&
                <div style={{zIndex: "999"}} className="centermodal">
                    <div className="wrapper">
                        <div className="pixel w-3/4 xl:w-1/2 h-3/4 xl:h-1/2 bg-neutral-900 p-2 xl:p-8 gap-10 flex flex-col items-center justify-center text-sm text-left" style={{boxShadow: "6px 6px 0 #00000040"}}>
                            <div className='text-2xl text-red-500'>ERROR! [{'beta ' + v}]</div>
                            <div className='w-5/6 h-[350px] overflow-hidden ellipsis'>{errMsg}</div>
                            <button className='w-2/3 p-3 rounded-full bg-slate-700' onClick={() => setErrMsg(null)}>CLOSE</button>
                        </div>
                    </div>
                </div>
            }
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <Headbar callMode={callMode} navigate={navigate} />
                    {mode === 0 && <Home />}
                    <Suspense fallback={<div className="w-full h-[100vh] flex items-center justify-center" />}>
                        {mode === 1 && <Fields callMode={callMode} navigate={navigate} />}
                        {mode === 11 && <CmdaoValley config={wagmiAdapter.wagmiConfig} intrasubModetext={intrasubModetext} navigate={navigate} setIsLoading={setIsLoading} txupdate={txupdate} setTxupdate={setTxupdate} setErrMsg={setErrMsg} />}
                        {mode === 2 && <Swap config={wagmiAdapter.wagmiConfig} setIsLoading={setIsLoading} txupdate={txupdate} setTxupdate={setTxupdate} setErrMsg={setErrMsg} />}
                    </Suspense>
                    {mode === 404 &&
                        <div className="w-full h-[100vh] flex items-center justify-center pixel">
                            <div className="text-2xl">404 not found!</div>
                        </div>
                    }
                </QueryClientProvider>
            </WagmiProvider>                
            <footer className='mt-4 w-full p-8 flex flex-row justify-between'>
                <div className="gap-3 flex flex-col text-xs text-left">
                    <div>{'OpenBBQ ' + v}</div>
                    <a style={{color: "#fff", textDecoration: "none"}} href="https://github.com/coshi190/openbbq" target="_blank" rel="noreferrer">Github</a>
                </div>
                <div className="gap-3 flex flex-col text-xs text-right">
                    <a style={{color: "#fff", textDecoration: "none"}} href="https://discord.gg/k92ReT5EYy" target="_blank" rel="noreferrer">Chat</a>
                </div>
            </footer>
        </>
    )
}
