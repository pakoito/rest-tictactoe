require './http_client.rb'
require 'json'
require 'yaml'

describe "curl" do
  specify "http/get are returned as yaml" do 
    yaml = YAML.load(`curl -s http://localhost:3000`)
    expect(yaml["encode"]).not_to be(nil)
  end
end
