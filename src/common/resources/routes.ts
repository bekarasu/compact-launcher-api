import AboutUsPage from '../../client/app/pages/AboutUsPage'
import HomePage from '../../client/app/pages/HomePage'
import ProgramPage from '../../client/app/pages/ProgramPage'
export default [
  {
    ...HomePage,
    path: '/',
    exact: true,
  },
  {
    component: AboutUsPage,
    path: '/about-us',
    exact: true,
    loadData: async () => {
      return null
    },
  },
  {
    ...ProgramPage,
    path: '/programs/:slug',
  },
]
