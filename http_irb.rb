require 'net/http'
require 'json'
require './http_client'

class HttpIrb
  puts "\twelcome to HttpIrb, a way to interact with an http endpoint using IRB"
  puts "\tstart by initializing an instance of HttpIrb: hi = HttpIrb.new"

  def initialize
    @client = HttpClient.new
    puts ""
    puts "\texcellent. now set your host using the following method on your instance (in this case I called it 'hi'): hi.set_host \"localhost:3000\""
    puts ""
  end

  def help
    puts ""
    puts "\tassuming your instance name is called 'hi'"
    puts "\tnow you can do a get (json): hi.get \"/\""
    puts "\tor a post (json): hi.post url, jsonPayload (as Hash) example: hi.post \"/profile\", { :name => \"John Doe\" }"
    puts "\tyou can set your Authorization header too: hi.authorization value"
    puts ""
  end

  def set_host host
    puts ""
    puts "\thost set to: http://#{host}"
    puts ""
    puts help

    puts ""
    puts "\tif you need the information above again. just call the following method: hi.help"
    puts ""

    @client.set_host host
  end

  def authorization= authorization
    @client.authorization = authorization
  end

  def authorization
    @client.authorization
  end

  def post path, payload
    puts "\thttp/post: #{path}"
    json = @client.post path, payload
    puts ""
    puts JSON.pretty_generate(json)
    puts ""
    json
  end

  def get path 
    puts "\thttp/get: #{path}"
    json = @client.get path
    puts ""
    puts JSON.pretty_generate(json)
    puts ""
    json
  end
end
