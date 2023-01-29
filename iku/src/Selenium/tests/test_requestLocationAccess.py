# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestRequestLocationAccess():
  def setup_method(self, method):
    options = webdriver.ChromeOptions()
    options.addArguments("enable-geolocation")
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_requestLocationAccess(self):
    self.driver.get("http://localhost:3000/")
    self.driver.set_window_size(1294, 1392)
    #TODO: Assert that address is inputted into the field if the user shares their location
  