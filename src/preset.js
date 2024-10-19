export const _nav1 = [
  { icon: 'chat',to: '/chat/public', title: 'chat' },
  { icon: 'groups',to: '/room/private', title: 'room' },
  { icon: 'contacts',to: '/contacts/public', title: 'contacts' },
  // { icon: 'add',to: '/new/public', title: 'new' },
  { icon: 'search',to: '/search/public', title: 'search' },
  { icon: 'more_horiz',to: '/me', title: 'me' },
];
export const _nav2 = [
  { icon: 'chat',to: '/chat', title: 'private' },
  { icon: 'public',to: '/public', title: 'public' },
];
export const _customListNav2 = {
  room:[
    { icon: 'group_add',to: '/chat/public', title: 'room' },
  ]
}
export const _navTree = _nav1.map((index) => {
  return { index, ele: _nav2 };
});
