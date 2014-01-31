require './specification/spec_helper.rb'

describe "tic toe" do
  it "works", :focus => true do
    yaml = get "/tictactoe"
    expect(yaml["board"][0]).to eq("...")
    expect(yaml["board"][1]).to eq("...")
    expect(yaml["board"][2]).to eq("...")

    yaml = get yaml["moves"]["topleft"]
    expect(yaml["board"][0]).to eq("x..")
    expect(yaml["board"][1]).to eq("...")
    expect(yaml["board"][2]).to eq("...")
  end

  def get path
    YAML.load(`curl -s "http://localhost:3000#{path}"`)
  end
end
