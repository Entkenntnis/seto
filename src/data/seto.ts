interface Klasse {
  title: string
  content: { id: number; title: string }[]
}

export const data: Klasse[] = [
  {
    title: '7. Klasse',
    content: [{ id: 23869, title: 'Aufgaben zur Prozentrechnung' }],
  },
  {
    title: '8. Klasse',
    content: [
      { id: 66809, title: 'Aufgaben zum Dreisatz' },
      {
        id: 31911,
        title:
          'Aufgaben zu linearen Funktionen als Geraden im Koordinatensystem',
      },
    ],
  },
  {
    title: '9./10. Klasse',
    content: [
      {
        id: 30680,
        title: 'Aufgaben zum Sinus, Kosinus, Tangens im rechtwinkligen Dreieck',
      },
    ],
  },
  {
    title: 'Mittelschule Bayern - Quali Abschlussprüfungen Mathe 2022',
    content: [
      { id: 261570, title: 'Teil A' },
      { id: 261603, title: 'Teil B, Gruppe 1' },
      { id: 261604, title: 'Teil B, Gruppe 2' },
    ],
  },
]
