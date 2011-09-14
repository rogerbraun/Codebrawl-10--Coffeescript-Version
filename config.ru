require "rubygems"
require "bundler"
require "./sc.rb"
Bundler.require

run Sinatra::Application
