require './specification/spec_helper.rb'

describe "curl" do
  specify "http/get are returned as yaml" do 
    yaml = YAML.load(`curl -s http://localhost:3000`)
    expect(yaml["encode"]).not_to be(nil)
  end
end
