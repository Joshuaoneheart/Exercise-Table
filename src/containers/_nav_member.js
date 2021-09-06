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
    _children: ['表單']
  },
  {
    _tag: 'CSidebarNavItem',
    name: '表單填寫',
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
