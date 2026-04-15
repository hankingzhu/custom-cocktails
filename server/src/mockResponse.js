// Hardcoded response used when USE_MOCK=true — no Claude API call made.
export const MOCK_RESPONSE = {
  cocktails: [
    {
      rank: 1,
      name: 'Smoked Manhattan',
      moodMatch: 'A brooding, contemplative drink for when the day has weighed on you. The smoke mirrors the complexity you\'re carrying; the sweetness promises tomorrow will be lighter.',
      ingredients: [
        { item: 'Rye whiskey', amount: '2 oz' },
        { item: 'Sweet vermouth', amount: '1 oz' },
        { item: 'Angostura bitters', amount: '2 dashes' },
        { item: 'Orange bitters', amount: '1 dash' }
      ],
      method: 'Combine all ingredients in a mixing glass with ice. Stir for 30 seconds until well chilled. Strain into a coupe. Use a smoking gun with cherry wood chips to lightly smoke the glass before pouring, or pass the expressed orange peel through a flame.',
      glass: 'Coupe',
      garnish: 'Expressed orange peel'
    },
    {
      rank: 2,
      name: 'Quiet Storm',
      moodMatch: 'For the tension you haven\'t quite shaken — this drink starts sharp and ends with a long, warming finish that loosens the shoulders.',
      ingredients: [
        { item: 'Mezcal', amount: '1.5 oz' },
        { item: 'Amaro Nonino', amount: '0.75 oz' },
        { item: 'Fresh lemon juice', amount: '0.5 oz' },
        { item: 'Honey syrup', amount: '0.5 oz' },
        { item: 'Egg white', amount: '1' }
      ],
      method: 'Dry shake all ingredients without ice for 15 seconds to emulsify the egg white. Add ice and shake hard for another 15 seconds. Double strain into a chilled rocks glass over a large ice cube.',
      glass: 'Rocks',
      garnish: 'Three drops of Angostura bitters on the foam'
    },
    {
      rank: 3,
      name: 'The Long Way Home',
      moodMatch: 'Sometimes you just need something cold, tall, and uncomplicated — a drink that asks nothing of you while you gather yourself.',
      ingredients: [
        { item: 'Gin', amount: '1.5 oz' },
        { item: 'Elderflower liqueur', amount: '0.5 oz' },
        { item: 'Fresh cucumber juice', amount: '1 oz' },
        { item: 'Fresh lime juice', amount: '0.75 oz' },
        { item: 'Soda water', amount: 'Top' }
      ],
      method: 'Combine gin, elderflower, cucumber juice and lime in a shaker with ice. Shake briefly and strain into a highball glass over fresh ice. Top with soda water and stir gently.',
      glass: 'Highball',
      garnish: 'Cucumber ribbon'
    }
  ]
}
