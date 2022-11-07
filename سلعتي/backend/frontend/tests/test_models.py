'''
  File: test_models.py
  Description: Contains all projects models test
'''
from main import models
from django.test import TestCase


# User
class UserTest(TestCase):
  '''
    Test custom functions in the user model
  '''

  def create_user(self, username='yassine', email='yassine@yassine.com', is_distributor=False, is_client=False):
    '''
      Create new user using the custom function 'create_user'
    '''
    user = models.User()
    return user.create_user(
        username=username,
        phone=email,
        password=email,
        is_distributor=is_distributor,
        is_client=is_client
    )

  def test_user_creation(self):
    user = self.create_user()
    self.assertTrue(isinstance(user, models.User))


# Client
class ClientTest(TestCase):
  '''
    Test custom functions in the Client model
  '''

  def create_client(self):
    user = models.User()
    username = 'yassine'
    phone = '06394598345'
    password = '123456'
    address = 'address'
    city = 'city'
    geo_location = '{}'
    user.create_user(username, phone, password, False, True)
    return models.Client(
        user=user,
        phone=phone,
        address=address,
        city=city,
        geo_location=geo_location
    )

  def test_client_creation(self):
    client = self.create_client()
    self.assertTrue(isinstance(client, models.Client))
    self.assertEqual(client.__str__(), client.phone)


# Distributor
class DistributorTest(TestCase):
  '''
    Test custom function in the Distributor model
  '''

  def create_distributor(self):
    user = models.User()
    username = 'yassine'
    email = 'yassine@yassine.com'
    password = '123456'
    address = 'address'
    region = 'region'
    user.create_user(username, email, password, True)
    return models.Distributor(
        user=user,
        email=email,
        address=address,
        region=region
    )

  def test_distributor_creation(self):
    distributor = self.create_distributor()
    self.assertTrue(isinstance(distributor, models.Distributor))
    self.assertEqual(distributor.__str__(), distributor.email)


# Category
class CategoryTest(TestCase):
  '''
    Test custom functions in the Category model
  '''

  def create_category(self):
    name = 'Skar'
    image = 'https://google.com'
    return models.Category(
        name=name,
        image=image
    )

  def test_category_creation(self):
    category = self.create_category()
    self.assertTrue(isinstance(category, models.Category))
    self.assertEqual(category.name, category.__str__())


# Product
class ProductTest(TestCase):
  '''
    Test custom functions in the Product model
  '''

  def create_product(self):
    key = '54356'
    name = 'Korsi'
    image = 'https://google.com'
    return models.Product(
        key=key,
        name=name,
        image=image
    )

  def test_product_creation(self):
    product = self.create_product()
    self.assertTrue(isinstance(product, models.Product))
    self.assertEqual(product.name, product.__str__())


# ProductState
class ProductStateTest(TestCase):
  '''
    Test custom functions in the ProductState model
  '''

  def create_product_state(self, distributor=None):
    if not distributor:
      distributor = DistributorTest().create_distributor()
    product = ProductTest().create_product()
    category = CategoryTest().create_category()
    price = '54'
    units = 'kg,10kg,20kg'
    status = True
    return models.ProductState(
        distributor=distributor,
        product=product,
        category=category,
        price=price,
        units=units,
        status=status
    )

  def test_product_state_creation(self):
    product_state = self.create_product_state()
    self.assertTrue(isinstance(product_state, models.ProductState))
    self.assertEqual(product_state.product.__str__(), product_state.__str__())


# Order
class OrderTest(TestCase):
  '''
    Test custom functions in the Order model
  '''

  def create_order(self):
    order_id = '5455456'
    client = ClientTest().create_client()
    distributor = DistributorTest().create_distributor()
    product_state = ProductStateTest().create_product_state(distributor=distributor)
    quantity = 54
    unit = 'kg'
    validated = False

    return models.Order(
        order_id=order_id,
        client=client,
        distributor=distributor,
        product_state=product_state,
        quantity=quantity,
        unit=unit,
        validated=validated
    )

  def test_order_creation(self):
    order = self.create_order()
    self.assertTrue(isinstance(order, models.Order))
    name = f'{order.quantity} {order.unit} - {order.product_state.__str__()}'
    self.assertEqual(name, order.__str__())


# BannedClient
class BannedClientTest(TestCase):
  '''
    Test custom functions in the BannedClient model
  '''

  def create_banned_client(self):
    client = ClientTest().create_client()
    distributor = DistributorTest().create_distributor()
    notification = 'Not paid'

    return models.BannedClient(
        client=client,
        distributor=distributor,
        notification=notification
    )

  def test_banned_client_creation(self):
    banned_client = self.create_banned_client()
    self.assertTrue(isinstance(banned_client, models.BannedClient))
    name = f'{banned_client.distributor.__str__()}--{banned_client.client.__str__()}'
    self.assertEqual(name, banned_client.__str__())


# CancelOrder
class CanceledOrderTest(TestCase):
  '''
    Test custom functions in the CanceledOrde model
  '''

  def create_cancel_order(self):
    client = ClientTest().create_client()
    distributor = DistributorTest().create_distributor()
    product = ProductTest().create_product()
    notification = 'Not paid'

    return models.CanceledOrder(
        client=client,
        distributor=distributor,
        product=product,
        notification=notification
    )

  def test_canceled_order(self):
    canceled_order = self.create_cancel_order()
    self.assertTrue(isinstance(canceled_order, models.CanceledOrder))
    name = f'{canceled_order.distributor.__str__()}--{canceled_order.client.__str__()}'
    self.assertEqual(name, canceled_order.__str__())


# Favorite
class FavoriteTest(TestCase):
  '''
    Test custom functions in the Favorite model
  '''

  def create_favorite(self):
    client = ClientTest().create_client()
    product_state = ProductStateTest().create_product_state()

    return models.Favorite(
        client=client,
        product_state=product_state
    )

  def test_history_creation(self):
    favorite = self.create_favorite()
    self.assertTrue(isinstance(favorite, models.Favorite))
    name = favorite.client.__str__()
    self.assertEqual(name, favorite.__str__())


# History
class HistoryTest(TestCase):
  '''
    Test custom functions in the History model
  '''

  def create_history(self):
    invoice_id = '54546'
    client = ClientTest().create_client()
    distributor = DistributorTest().create_distributor()
    product_state = ProductStateTest().create_product_state(distributor)
    quantity = 98
    unit = 'kg'
    purchase_price = '98'

    return models.History(
        invoice_id=invoice_id,
        client=client,
        distributor=distributor,
        product_state=product_state,
        quantity=quantity,
        unit=unit,
        purchase_price=purchase_price
    )

  def test_history_creation(self):
    history = self.create_history()
    self.assertTrue(isinstance(history, models.History))
