# using resolved_model gpt-4o-2024-08-06# created from response, to create create_db_models.sqlite, with test data
#    that is used to create project
# should run without error in manager 
#    if not, check for decimal, indent, or import issues

import decimal
import logging
import sqlalchemy
from sqlalchemy.sql import func 
from logic_bank.logic_bank import Rule
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, DateTime, Numeric, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
from datetime import date   
from datetime import datetime

logging.getLogger('sqlalchemy.engine.Engine').disabled = True  # remove for additional logging

Base = declarative_base()  # from system/genai/create_db_models_inserts/create_db_models_prefix.py


class Customer(Base):
    """
    description: Table to store customer information including balance and credit limit.
    """
    __tablename__ = 'customers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    balance = Column(Integer, nullable=False)  # Derived
    credit_limit = Column(Integer, nullable=False)


class Order(Base):
    """
    description: Table to store order details including total amount and shipment status.
    """
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    date_shipped = Column(DateTime, nullable=True)
    amount_total = Column(Integer, nullable=False)  # Derived


class Item(Base):
    """
    description: Table to store item details including quantity, unit price, and amount.
    """
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('orders.id'))
    product_id = Column(Integer, ForeignKey('products.id'))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)  # Copied
    amount = Column(Integer, nullable=False)  # Derived


class Product(Base):
    """
    description: Table to store product information including unit price.
    """
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    unit_price = Column(Integer, nullable=False)


# ALS/GenAI: Create an SQLite database
engine = create_engine('sqlite:///system/genai/temp/create_db_models.sqlite')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# ALS/GenAI: Prepare for sample data

from datetime import date

# Creating test data for products
product1 = Product(id=1, name='Pet Food', unit_price=20)
product2 = Product(id=2, name='Pet Toy', unit_price=10)
product3 = Product(id=3, name='Pet Bed', unit_price=50)
product4 = Product(id=4, name='Pet Carrier', unit_price=80)

# Creating test data for customers
customer1 = Customer(id=1, name='Alice', balance=150, credit_limit=200)
customer2 = Customer(id=2, name='Bob', balance=90, credit_limit=100)
customer3 = Customer(id=3, name='Charlie', balance=0, credit_limit=300)
customer4 = Customer(id=4, name='Diana', balance=60, credit_limit=150)

# Creating test data for orders
order1 = Order(id=1, customer_id=1, date_shipped=None, amount_total=100)
order2 = Order(id=2, customer_id=2, date_shipped=date(2023, 7, 15), amount_total=90)
order3 = Order(id=3, customer_id=3, date_shipped=None, amount_total=0)
order4 = Order(id=4, customer_id=4, date_shipped=date(2023, 5, 20), amount_total=60)

# Creating test data for items
item1 = Item(id=1, order_id=1, product_id=1, quantity=5, unit_price=20, amount=100)
item2 = Item(id=2, order_id=2, product_id=2, quantity=9, unit_price=10, amount=90)
item3 = Item(id=3, order_id=4, product_id=3, quantity=1, unit_price=50, amount=50)
item4 = Item(id=4, order_id=4, product_id=4, quantity=1, unit_price=80, amount=80)


session.add_all([product1, product2, product3, product4, customer1, customer2, customer3, customer4, order1, order2, order3, order4, item1, item2, item3, item4])
session.commit()
