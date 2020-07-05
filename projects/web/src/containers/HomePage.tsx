import * as React from 'react'
import styles from './styles/HomePage.module.scss'
import { transformStyles } from 'react-dom-basic-kit'
import { Link } from 'react-router-dom'
import { userSlice, accountAsyncAction, accountSelector } from '@smoex-business/user'
const cx = transformStyles(styles)

type IHomePageProps = {
  className?: string
}

export const HomePage: React.FC = (props: any) => {
  const [info = {}] = userSlice.useSelector(accountSelector.info)
  return (
    <section className={cx('home-page')}>
      <Link to="/admin" >To admin</Link><br />
      <Link to="/admin/user" >To admin user</Link>
      <div onClick={() => window.location.href = '/admin'}> admin </div>
      HomePage web
      <div>{info && info.group}</div>
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
