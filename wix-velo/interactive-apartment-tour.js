$w.onReady(function () {
  const items = [
    { button: '#livingBtn', state: 'livingState', indicator: '#livingIndicator' },
    { button: '#kitchenBtn', state: 'kitchenState', indicator: '#kitchenIndicator' },
    { button: '#bedroomBtn', state: 'bedroomState', indicator: '#bedroomIndicator' },
    { button: '#terraceBtn', state: 'terraceState', indicator: '#terraceIndicator' },
    { button: '#poolBtn', state: 'poolState', indicator: '#poolIndicator' }
  ];

  async function selectSpace(selected) {
    items.forEach(item => $w(item.indicator).hide());
    $w(selected.indicator).show();
    await $w('#tourBox').changeState(selected.state);
  }

  items.forEach(item => $w(item.button).onClick(() => selectSpace(item)));
  selectSpace(items[0]);
});
