L.drawLocal = {
	draw: {
		toolbar: {
			actions: {
				title: 'Zeichnen abbrechen',
				text: 'Abbrechen'
			},
			undo: {
				title: 'Zuletzt gezeichneten Punkt löschen',
				text: 'Letzten Punkt löschen'
			},
			buttons: {
				polyline: 'Linie zeichnen',
				polygon: 'Polygon zeichnen',
				rectangle: 'Rechteck zeichnen',
				circle: 'Kreis zeichnen',
				marker: 'Marker zeichnen'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: 'Klicke und ziehe um einen Kreis zu zeichnen.'
				},
				radius: 'Radius'
			},
			marker: {
				tooltip: {
					start: 'Klicke um einen Marker zu platzieren.'
				}
			},
			polygon: {
				tooltip: {
					start: 'Klicke um mit dem Zeichnen zu beginnen.',
					cont: 'Klicke um mit dem Zeichnen fortzufahren.',
					end: 'Klicke den ersten Punkt um das Zeichen abzuschließen.'
				}
			},
			polyline: {
				error: '<strong>Fehler:</strong> Kanten dürfen sich nich überschneiden!',
				tooltip: {
					start: 'Klicke um mit dem Zeichnen zu beginnen.',
					cont: 'Klicke um mit dem Zeichnen fortzufahren.',
					end: 'Klicke den letzten Punkt um das Zeichen abzuschließen.'
				}
			},
			rectangle: {
				tooltip: {
					start: 'Klicke und ziehe um ein Rechteck zu zeichnen.'
				}
			},
			simpleshape: {
				tooltip: {
					end: 'Zum Abschließen Maus loslassen.'
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: 'Änderungen speichern.',
					text: 'Speichern'
				},
				cancel: {
					title: 'Bearbeiten abbrechen, Änderungen verwerfen.',
					text: 'Abbrechen'
				}
			},
			buttons: {
				edit: 'Objekte bearbeiten.',
				editDisabled: 'Keine Objekte zum Bearbeiten.',
				remove: 'Objekte löschen.',
				removeDisabled: 'Keine Objekte zu löschen.'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Zum Bearbeiten Knoten oder Marker verschieben.',
					subtext: 'Klicke auf Abbrechen um Änderungen zu verwerfen.'
				}
			},
			remove: {
				tooltip: {
					text: 'Auf ein Objekt klicken, um es zu entfernen'
				}
			}
		}
	}
};