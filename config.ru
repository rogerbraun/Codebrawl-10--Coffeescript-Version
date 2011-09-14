require "rubygems"
require "bundler"
Bundler.require

get "/" do
  redirect to "/index.html"
end

run Sinatra::Application
