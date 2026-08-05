$w.onReady(function () {
  const plans = {
    relax: ['Settle in and enjoy the terrace.', 'Combine the beach with pool time.', 'Take a coastal walk and enjoy local dining.'],
    family: ['Explore the community facilities.', 'Enjoy a beach morning and pool afternoon.', 'Visit La Zenia Boulevard for dining and entertainment.'],
    explore: ['Walk to Playa Flamenca.', 'Explore La Zenia Boulevard.', 'Mix a pool day with nearby cafés and essentials.']
  };

  $w('#createPlanBtn').onClick(() => {
    const style = $w('#holidayStyle').value;
    const days = Number($w('#stayLength').value || 3);
    const selected = (plans[style] || plans.relax).slice(0, days);
    $w('#planRepeater').data = selected.map((text, i) => ({ _id: String(i + 1), day: `Day ${i + 1}`, text }));
    $w('#planRepeater').onItemReady(($item, data) => { $item('#dayTitle').text = data.day; $item('#dayText').text = data.text; });
    $w('#planResults').expand();
  });
});
