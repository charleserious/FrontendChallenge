export type NCEvent = {
  title: string;
  dueDate: Date | null;
};

const NC_EVENT_KEY = 'nc_event';

export const DEFAULT_NC_EVENT = {
  title: '',
  dueDate: null,
};

export const getEventFromLocalStorage = (): NCEvent => {
  const eventStr = localStorage.getItem(NC_EVENT_KEY);
  if (!eventStr) return { ...DEFAULT_NC_EVENT };

  try {
    const event = JSON.parse(eventStr) as NCEvent;

    event.dueDate = event.dueDate && new Date(event.dueDate);

    return event;
  } catch (error) {
    console.error('Error parsing event from localStorage', error);
    return { ...DEFAULT_NC_EVENT };
  }
};

const saveEventToLocalStorage = (event: NCEvent): void => {
  try {
    const oldEvent = getEventFromLocalStorage();
    const newEvent = {
      ...oldEvent,
      ...(event.title ? { title: event.title } : {}),
      ...(event.dueDate ? { dueDate: event.dueDate.toISOString() } : {}),
    };
    localStorage.setItem(NC_EVENT_KEY, JSON.stringify(newEvent));
  } catch (error) {
    // We can throw the error to the invoker, depending on the complexity of the logic and implementation needs
    console.error('Error saving event to localStorage', error);
  }
};

export const saveNCEventTitle = (title: NCEvent['title']) => {
  const oldEvent = getEventFromLocalStorage();
  saveEventToLocalStorage({ ...oldEvent, title });
};

export const saveNCEventDueDate = (dueDate: NCEvent['dueDate']) => {
  const oldEvent = getEventFromLocalStorage();
  saveEventToLocalStorage({ ...oldEvent, dueDate });
};

export const deleteNCEvent = () => {
  localStorage.removeItem(NC_EVENT_KEY);
};
