import { GetStaticProps } from "next"
import React, { FC } from "react"
import { APIDocContextProvider } from "../components/APIDocContext"
import { generalReadPackage } from "../components/ReadPackage"
import { Layout } from "antd"
import { MenuElm } from "../components/Menu"
import { APIDocProps } from "../components/APIDocProps"

export const getStaticProps: GetStaticProps<APIDocProps> = async (context) => {
  await generalReadPackage.prepare()

  return {
    props: {
      mapItems: generalReadPackage.mapItems,
      items: generalReadPackage.items,
      toc: generalReadPackage.toc,
      uris: generalReadPackage.uris,
    },
  }
}

const App: FC<APIDocProps> = ({ children, ...props }) => {
  return (
    <APIDocContextProvider {...props}>
      <Layout>
        <Layout.Content>
          <Layout>
            <Layout.Sider>
              <MenuElm></MenuElm>
            </Layout.Sider>
            <Layout.Content>Content</Layout.Content>
          </Layout>
        </Layout.Content>
      </Layout>
    </APIDocContextProvider>
  )
}

export default App
