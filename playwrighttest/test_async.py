import uuid
import pytest
from playwright.async_api import Page, expect

site = 'https://shroomate.onrender.com'

# @pytest.mark.asyncio
# async def test_truebar_async(page_async: Page) -> None:
#   await page_async.goto('https://dev-editor.true-bar.si/')
#   await page_async.get_by_placeholder('Uporabniško ime').fill('esa')
#   await page_async.get_by_placeholder('Geslo').fill('juhu')
#   await page_async.get_by_role('button', name='PRIJAVA').click()

#   for i in range(2):
#     e = page_async.get_by_text('Vneseni podatki so napačni').nth(i)
#     await expect(e).to_contain_text('Vneseni podatki so napačni')
#     await expect(e).to_be_visible()


async def login(page_async: Page, mail='test@shrooma.te', pwd='testikl') -> None:
  await expect(btn := page_async.get_by_role('button', name='Log in')).to_be_visible()
  await btn.click()
  await expect(page_async.get_by_role('heading', name='Log in')).to_be_visible()
  await page_async.get_by_label('Email').fill(mail)
  await page_async.get_by_label('Password').fill(pwd)
  await page_async.get_by_role('button', name='Log in').click()
 

@pytest.mark.asyncio
async def test_login_ok(page_async: Page) -> None:
  await page_async.goto(site)
  await login(page_async)
  await expect(page_async.get_by_text('You are now logged in...')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Sighting!')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Filter')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Messages')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Settings')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Log out')).to_be_visible()
  await page_async.get_by_text('Log out').click()
  await expect(page_async.get_by_text('You have successfully logged out...')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Sighting!')).not_to_be_visible()
  await expect(page_async.get_by_role('button', name='Filter')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Messages')).not_to_be_visible()
  await expect(page_async.get_by_role('button', name='Settings')).not_to_be_visible()
  await expect(page_async.get_by_role('button', name='Log out')).not_to_be_visible()
  await expect(page_async.get_by_role('button', name='Log in')).to_be_visible()

@pytest.mark.asyncio
async def test_login_fails(page_async: Page) -> None:
  await page_async.goto(site)
  await page_async.get_by_text('Log in').click()
  await page_async.get_by_label('Email').fill('test@shrooma.te')
  await page_async.get_by_label('Password').fill('testis')
  await page_async.get_by_role('button', name='Log in').click()
  await expect(page_async.get_by_role('heading', name='Log in')).to_be_visible()
  await expect(page_async.get_by_text('incorrect login')).to_be_visible()

@pytest.mark.asyncio
async def test_signup(page_async: Page) -> None:
  await page_async.goto(site)
  await expect(btn := page_async.get_by_role('button', name='Sign up')).to_be_visible()
  await btn.click()
  await expect(page_async.get_by_role('heading', name='Sign up')).to_be_visible()
  name = str(uuid.uuid4())
  await page_async.get_by_label('Name').fill(name)
  mail = f'{name}@shrooma.te'
  await page_async.get_by_label('Email').fill(mail)
  await page_async.get_by_label('Password').fill('testis')
  await page_async.get_by_role('button', name='Sign up for free').click()
  await expect(page_async.get_by_label('Sign up successful').first).to_be_visible()
  await expect(link := page_async.get_by_role('link', name='this link')).to_be_visible()
  await link.click()
  await page_async.goto(site)
  await login(page_async, mail, 'testis')

@pytest.mark.asyncio
async def test_sighting(page_async: Page) -> None:
  await page_async.goto(site)
  await login(page_async)
  await page_async.get_by_role('button', name='Sighting!').click()
  await expect(page_async.get_by_role('heading', name='New sighting!')).to_be_visible()
  await expect(page_async.get_by_label('Species')).to_be_visible()
  await expect(page_async.get_by_label('Visibility')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Cancel')).to_be_visible()
  await expect(save := page_async.get_by_role('button', name='Save')).to_be_visible()
  await expect(page_async.get_by_text('Add one to three photos of the sighting!')).not_to_be_visible()
  await save.click()
  await expect(page_async.get_by_text('Add one to three photos of the sighting!')).to_be_visible()

@pytest.mark.asyncio
async def test_settings(page_async: Page) -> None:
  await page_async.goto(site)
  await login(page_async)
  await expect(page_async.get_by_role('heading', name='My account settings')).not_to_be_visible()
  await page_async.get_by_role('button', name='Settings').click()
  await expect(page_async.get_by_role('heading', name='My account settings')).to_be_visible()
  await expect(page_async.get_by_label('Name')).to_be_visible()
  await expect(page_async.get_by_label('Email')).to_be_visible()
  await expect(page_async.get_by_label('Location friends')).to_be_visible()
  await page_async.get_by_label("Location friends").select_option("micro")
  await expect(page_async.get_by_label('Location everyone')).to_be_visible()
  await page_async.get_by_label("Location everyone").select_option("region")
  await expect(page_async.get_by_label('My friends')).to_be_visible()
  await expect(page_async.get_by_role('button', name='Cancel')).to_be_visible()
  await expect(save := page_async.get_by_role('button', name='Save')).to_be_visible()
  await save.click()
  await expect(page_async.get_by_role('heading', name='My account settings')).not_to_be_visible()


@pytest.mark.asyncio
async def test_map_friend(page_async: Page) -> None:
  await page_async.goto(site)
  await login(page_async)
  await page_async.locator("div:nth-child(4) > img:nth-child(5)").click()
  await expect(page_async.get_by_text("Agaricus arvensis")).to_be_visible()
  await expect(page_async.get_by_role("img", name="img")).to_be_visible()
  await expect(page_async.get_by_text("Seen by Joze")).to_be_visible()
  await page_async.get_by_label("Close popup").click()

@pytest.mark.asyncio
async def test_map_everyone(page_async: Page) -> None:
  await page_async.goto(site)
  await page_async.locator("div:nth-child(4) > img:nth-child(5)").click()
  await expect(page_async.get_by_text("Agaricus arvensis")).to_be_visible()
  await expect(page_async.get_by_role("img", name="img")).to_be_visible()
  await expect(page_async.get_by_text("Seen by Joze")).to_be_visible()
  await page_async.get_by_label("Close popup").click()
