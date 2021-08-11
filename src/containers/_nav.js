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
    _tag: 'CSidebarNavTitle',
    _children: ['Extras'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Pages',
    route: '/pages',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Login',
        to: '/login',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Register',
        to: '/register',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Error 404',
        to: '/404',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Disabled',
    icon: 'cil-ban',
    badge: {
      color: 'secondary',
      text: 'NEW',
    },
    addLinkClass: 'c-disabled',
    'disabled': true
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Labels']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label danger',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-danger'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label info',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-info'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Label warning',
    to: '',
    icon: {
      name: 'cil-star',
      className: 'text-warning'
    },
    label: true
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-2'
  }
]

export default _nav
