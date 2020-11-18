import * as React from 'react'
import styles from './styles/HomePage.module.scss'
import { transformStyles } from '@react-kits/dom'
import { Link } from 'react-router-dom'
const cx = transformStyles(styles)

type IHomePageProps = {
  className?: string
}

export const HomePage: React.FC = (props: any) => {
  // const [info = {}] = userSlice.useSelector(accountSelector.info)
  return (
    <section className={cx('home-page')}>
      <a href="/admin" >To admin</a><br />
      <Link to="/admin/user" >To admin user</Link>
      <div onClick={() => window.location.href = '/admin'}> admin </div>
      HomePage web
      {/* <div>{info && info.group}</div> */}
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
      <div className={cx('home-item')}>1</div>
    </section>
  )
}

export default HomePage
