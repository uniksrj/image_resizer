<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DesktopOnlyMiddleware
{
    /**
     * Handle an incoming request.
     * postgresql://neondb_owner:npg_9QfFoam4RhHE@ep-solitary-math-a1xpbv7l-pooler.ap-southeast-1.aws.neon.tech/imagetool?sslmode=require
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
