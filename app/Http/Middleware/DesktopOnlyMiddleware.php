<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DesktopOnlyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (preg_match("/Mobi|Android|iPhone|iPad|iPod|Windows Phone/i", $request->header('User-Agent'))) {
            return response(view('Access.mobile-blocked'));
        }

        return $next($request);
    }
}
