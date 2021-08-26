import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['操練情形查詢']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '個人',
    to: '/members',
    icon: 'cil-user',
  },
  {
    _tag: 'CSidebarNavItem',
    name: '活力組',
    to: '/theme/typography',
    icon: 'cil-bar-chart',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['管理功能']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '住戶管理',
    to: '/modifyresident',
    icon: 'cil-house'
  },
  {
    _tag: 'CSidebarNavItem',
    name: '活力組管理',
    to: '/modifygroup',
    icon: 'cil-group'
  },
  {
    _tag: 'CSidebarNavItem',
    name: '修改表單',
    to: '/modifyform',
    icon: 'cil-pencil'
  },
  {
    _tag: 'CSidebarNavItem',
    name: '表單預覽',
    to: '/form',
    icon: 'cil-spreadsheet'
  },
  {
    _tag: 'CSidebarNavDivider'
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav
