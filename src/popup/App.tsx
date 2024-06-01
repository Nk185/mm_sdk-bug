import { useForm } from '@tanstack/react-form'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { MetaMaskSDK, SDKProvider } from "@metamask/sdk";
//import createMetaMaskProvider from "./Provider";

const addressesAtom = atom<string[]>([])
const connectedAtom = atom((get) => get(addressesAtom).length > 0)

const getProvider: () => SDKProvider = (() => {
  // ↓ keep uncommented to connect to MM extension; comment to connect to MM mobile
  //(globalThis as any).ethereum = createMetaMaskProvider();

  const MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "Example App",
      url: "https://example.com",
    },
    extensionOnly: false,
    preferDesktop: false
    // Other options. 
  });

  let provider = null
  return () => (provider ??= MMSDK.getProvider())
})()

function RequestFundsForm() {
  const [response, setResponse] = useState<unknown>(null)

  const form = useForm<{ address: string }>({
    defaultValues: {
      address: import.meta.env.VITE_DEFAULT_ADDRESS || '',
    },
    onSubmit: async (form) => {
      getProvider()
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              to: form.value.address,
              from: addresses[0],
              gas: '0x76c0',
              value: '0x8ac7230489e80000',
              data: '0x',
              gasPrice: '0x4a817c800',
            },
          ],
        })
        .then(
          (response) => {
            console.log('response', response)
            setResponse(response)
          },
          (err) => {
            console.log('err', err)
            setResponse(err)
          }
        )
    },
  })

  const addresses = useAtomValue(addressesAtom)

  return (
    <form
      className="grid grid-cols-1 gap-1"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field name="address">
        {(field) => (
          <>
            <label className="text-base" htmlFor={field.name}>
              Address
            </label>
            <input
              className="text-xs border-b border-b-gray-400 py-2 px-2 font-mono"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </>
        )}
      </form.Field>
      <label>From</label>
      <div className="text-xs bg-gray-200 py-2 px-2 font-mono">
        {addresses[0]}
      </div>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" className="py-1 px-2 rounded-sm bg-gray-200">
            {isSubmitting ? 'Requesting Transfer...' : 'Request Transfer'}
          </button>
        )}
      </form.Subscribe>
      <div className="whitespaces-pre">{JSON.stringify(response, null, 2)}</div>
    </form>
  )
}

function ConnectForm() {
  const setAddresses = useSetAtom(addressesAtom)
  const form = useForm<{ address: string }>({
    onSubmit: async () => {
      getProvider()
        .request({
          method: 'eth_requestAccounts',
        })
        .then((values) => {
          if (
            !values ||
            !Array.isArray(values) ||
            !values.every((x) => typeof x === 'string')
          ) {
            throw new Error('Invalid addresses response')
          }
          setAddresses(values as string[])
        })
    },
  })

  return (
    <form
      className="grid grid-cols-1 gap-1"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" className="py-1 px-2 rounded-sm bg-gray-200">
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}

function App() {
  const connected = useAtomValue(connectedAtom)
  return (
    <div className="grid grid-cols-1 gap-1 px-1">
      <h1 className="font-bold">Metamask Integration App</h1>
      {connected ? <RequestFundsForm /> : <ConnectForm />}
    </div>
  )
}

export default App
