require './http_client.rb'
require 'json'
require 'yaml'
require 'rspec'

RSpec.configure do |config|
  config.filter_run :focus => true
  config.run_all_when_everything_filtered = true
end
