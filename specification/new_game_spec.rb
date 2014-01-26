require './specification/spec_helper.rb'

describe "new game" do
  include Helper

  before(:each) do
    @client = HttpClient.new
    @client.set_host "localhost:3000"
    @client.post "/reset"
  end

  specify "option to create game is only available if user authenticates" do
    expect(root(@client)["newgame"]).to eq(nil)

    register_user @client, "bobby", "password"

    expect(root(@client)["newgame"]).not_to eq(nil)
  end
end
