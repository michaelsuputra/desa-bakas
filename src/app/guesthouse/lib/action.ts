'use server';

export async function bookGuestHouse(formData: FormData) {
  const fullname = formData.get('fullname');
  const age = Number(formData.get('age'));
  const number_of_people = Number(formData.get('number_of_people'));
  const contact = Number(formData.get('contact'));
  const country = formData.get('country');
  const date_of_stay = formData.get('date_of_stay');
  const until_the_date = formData.get('until_the_date');
  const passport = formData.get('passport');
  const impression = formData.get('impression');

  console.log({
    fullname,
    age,
    number_of_people,
    contact,
    country,
    date_of_stay,
    until_the_date,
    passport,
    impression,
  });
}
